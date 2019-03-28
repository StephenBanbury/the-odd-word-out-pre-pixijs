import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IThesaurus } from './thesaurus';

@Injectable({ 
    providedIn: 'root' 
})
export class WordService {
    private thesaurusApiUrl = "https://words.bighugelabs.com/api/2/f8618d6158a86a5d11cb0079f164a540/";

    constructor(private http: HttpClient) {}

    getThesaurus(seedWord: string): Observable<IThesaurus> { 
        this.thesaurusApiUrl += seedWord + "/json";
        return this.http.get<IThesaurus>(this.thesaurusApiUrl);                    
    }


    randomWord(numWords: number, avoidWord: string): string[] {
        
        let words: string[] = ['feline','aqua','table','nose','cheek','boat','carpet','ceiling','run','think',
    'screen','consider','square','surround','border','think','jet','showdown','crossing','level','plane','compute',
    'button','rancour','wobble','stream','earth','embark','reach','search','lighten','shelve','key','board','bored',
    'shoe','wall','plant','fireplace','kitchen','utensil','application','window','dark','handle','step','tile','grass'];

        let response: Array<string> = new Array<string>();

        let n = 1;

        do {
            let rand = Math.floor(Math.random() * (words.length));
            let word = words[rand];
            if(word != avoidWord){
                response.push(word);
                n++;
            }
        } while (n <= numWords);

        return response;
    }

}
