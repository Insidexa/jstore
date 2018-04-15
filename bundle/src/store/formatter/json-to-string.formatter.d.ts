import { Observable } from 'rxjs/Observable';
import { FormatterInterface } from './formatter.interface';
export declare class JSONToStringFormatter implements FormatterInterface {
    transform(json: any): Observable<string>;
}
