import { Observable } from 'rxjs/Observable';
import { FormatterInterface } from './formatter.interface';
export declare class TrimFormatter implements FormatterInterface {
    transform(str: string): Observable<string>;
}
