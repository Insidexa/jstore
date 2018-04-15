import { Observable } from 'rxjs/Observable';
import { FormatterInterface } from './formatter.interface';
export declare class StringToJSONFormatter implements FormatterInterface {
    transform(str: string): Observable<any>;
}
