import { Observable } from 'rxjs/Observable';
import { FormatterInterface } from './formatter.interface';
export declare class ToStringFormatter implements FormatterInterface {
    transform(value: any): Observable<string>;
}
