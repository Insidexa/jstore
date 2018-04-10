import { Observable } from 'rxjs/Observable';

export class Middleware {
  protected name: string = null;
  protected beforeFn: any = null;
  protected afterFn: any = null;

  public changeName(name: string) {
    this.name = name;
  }

  public before(fn: Function) {
    this.beforeFn = fn;
  }

  public after(fn: Function) {
    this.afterFn = fn;
  }

  public getName(): string {
    return this.name;
  }

  public getAfter(): Function {
    return this.afterFn;
  }

  public getBefore(): Function {
    return this.afterFn;
  }
}