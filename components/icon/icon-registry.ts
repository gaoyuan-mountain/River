import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { RvError } from '../core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/catch';

export class RvIconNameNotFoundError extends RvError {
  constructor(iconName: string) {
    super(`Unable to find icon with the name "${iconName}"`);
  }
}

export class RvIconSvgTagNotFoundError extends RvError {
  constructor() {
    super('<svg> tag not found');
  }
}

class SvgIconConfig {
  svgElement: SVGElement = null;
  constructor(public url: string) { }
}

const iconKey = (namespace: string, name: string) => namespace + ':' + name;

@Injectable()
export class RvIconRegistry {
  private _svgIconConfigs = new Map<string, SvgIconConfig>();
  private _iconSetConfigs = new Map<string, SvgIconConfig>();
  private _cachedIconsByUrl = new Map<string, SVGElement>();
  private _inProgressUrlFetches = new Map<string, Observable<string>>();
  private _fontCssClassesByAlias = new Map<string, string>();
  private _defaultFontSetClass = 'rv-icons';

  constructor(private _http: Http) {}

  addSvgIcon(iconName: string, url: string): this {
    return this.addSvgIconInNamespace('', iconName, url);
  }

  addSvgIconInNamespace(namespace: string, iconName: string, url: string): this {
    const key = iconKey(namespace, iconName);
    this._svgIconConfigs.set(key, new SvgIconConfig(url));
    return this;
  }

  registerFontClassAlias(alias: string, className = alias): this {
    this._fontCssClassesByAlias.set(alias, className);
    return this;
  }

  classNameForFontAlias(alias: string): string {
    return this._fontCssClassesByAlias.get(alias) || alias;
  }

  setDefaultFontSetClass(className: string): this {
    this._defaultFontSetClass = className;
    return this;
  }

  getDefaultFontSetClass(): string {
    return this._defaultFontSetClass;
  }

  getSvgIconFromUrl(url: string): Observable<SVGElement> {
    if (this._cachedIconsByUrl.has(url)) {
      return Observable.of(cloneSvg(this._cachedIconsByUrl.get(url)));
    }

    return this._loadSvgIconFromConfig(new SvgIconConfig(url))
      .do(svg => this._cachedIconsByUrl.set(url, svg))
      .map(svg => cloneSvg(svg));
  }

  getNamedSvgIcon(name: string, namespace = ''): Observable<SVGElement> {
    const key = iconKey(namespace, name);
    if (this._svgIconConfigs.has(key)) {
      return this._getSvgFromConfig(this._svgIconConfigs.get(key));
    }

    const iconSetConfigs = this._iconSetConfigs.get(namespace);
    if (iconSetConfigs) {
      return this._getSvgFromIconSetConfigs(name, iconSetConfigs);
    }

    return Observable.throw(new RvIconNameNotFoundError(key));
  }

  private _getSvgFromConfig(config: SvgIconConfig): Observable<SVGElement> {
    if (config.svgElement) {
      return Observable.of(cloneSvg(config.svgElement));
    } else {
      return this._loadSvgIconFromConfig(config)
        .do(svg => config.svgElement = svg)
        .map(svg => cloneSvg(svg));
    }
  }

  private _getSvgFromIconSetConfigs(name: string, iconSetConfigs: SvgIconConfig[]): Observable<SVGElement> {
    const namedIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);
    if (namedIcon) {
      return Observable.of(namedIcon);
    }

    const iconSetFetchRequests: Observable<SVGElement>[] = iconSetConfigs
      .filter(iconSetConfig => !iconSetConfig.svgElement)
      .map(iconSetConfig =>
        this._loadSvgIconFromConfig(iconSetConfig)
          .catch((err: any, caught: Observable<SVGElement>): Observable<SVGElement> => {
            console.log('Loading icon ser URL: ${iconSetConfig.url} failed: ${err}');
            return Observable.of(null);
          })
          .do(svg => {
            if (svg) {
              iconSetConfig.svgElement = svg;
            }
          }));

    return Observable.forkJoin(iconSetFetchRequests)
      .map((ignoredResults: any) => {
        const foundIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);
        if (!foundIcon) {
          throw new RvIconNameNotFoundError(name);
        }

        return foundIcon;
      })
  }

  private _extractIconWithNameFromAnySet(iconName: string, iconSetConfigs: SvgIconConfig[]): SVGElement {
    for (let i = iconSetConfigs.length - 1 ; i >= 0 ; i--) {
      const config = iconSetConfigs[i];
      if (config.svgElement) {
        const foundIcon = this._extractSvgIconFromSet(config.svgElement, iconName, config);

        if (foundIcon) {
          return foundIcon;
        }
      }
    }
    return null;
  }

  private _loadSvgIconFromConfig(config: SvgIconConfig): Observable<SVGElement> {
    return this._fetchUrl(config.url)
      .map(svgText => this._createSvgElementForSingleIcon(svgText, config));
  }

  private _loadSvgIconSetFromConfig(config: SvgIconConfig): Observable<SVGElement> {
    return this._fetchUrl(config.url)
      .map((svgText) => this._svgElementFromString(svgText));
  }

  private _createSvgElementForSingleIcon(responseText: string, config: SvgIconConfig): SVGElement {
    const svg = this._svgElementFromString(responseText);
    this._setSvgAttributes(svg, config);
    return svg;
  }

  private _extractSvgIconFromSet(iconSet: SVGElement, iconName: string, config: SvgIconConfig): SVGElement {
    const iconNode = iconSet.querySelector('#' + iconName);
    if (!iconNode) {
      return null;
    }

    if (iconNode.tagName.toLowerCase() == 'svg') {
      return this._setSvgAttributes(<SVGElement>iconNode.cloneNode(true), config);
    }

    const svg = this._svgElementFromString('<svg></svg>');
    svg.appendChild(iconNode.cloneNode(true));
    return this._setSvgAttributes(svg, config);
  }

  private _svgElementFromString(str: string): SVGElement {
    const div = document.createElement('DIV');
    div.innerHTML = str;
    const svg = <SVGElement>div.querySelector('svg');
    if (!svg) {
      throw new RvIconSvgTagNotFoundError();
    }

    return svg;
  }

  private _setSvgAttributes(svg: SVGElement, config: SvgIconConfig): SVGElement {
    if (!svg.getAttribute('xmlns')) {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    svg.setAttribute('fit', '');
    svg.setAttribute('height', '100%');
    svg.setAttribute('width', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false');
    return svg;
  }

  private _fetchUrl(url: string): Observable<string> {
    if (this._inProgressUrlFetches.has(url)) {
      return this._inProgressUrlFetches.get(url);
    }

    const req = <Observable<string>> this._http.get(url)
      .map(response => response.text())
      .finally(() => {
        this._inProgressUrlFetches.delete(url)
      })
      .share();
    this._inProgressUrlFetches.set(url, req);
    return req;
  }
}

function cloneSvg(svg: SVGElement): SVGElement {
  return <SVGElement> svg.cloneNode(true);
}
