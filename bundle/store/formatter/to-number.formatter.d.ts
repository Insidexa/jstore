import { Observable } from 'rxjs/Observable';
import { FormatterInterface } from './formatter.interface';
export declare class ToNumberFormatter implements FormatterInterface {
    transform(str: string): Observable<number>;
}
