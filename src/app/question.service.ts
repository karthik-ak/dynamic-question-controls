import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from './question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'your-api-url'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  getQuestions(): Question[] {
    const json = `[
    {
      "questionId": "3",
      "label": "Are you intersted?",
      "required": true,
      "order": 3,
      "controlType": "radio",
      "questionGroupId": 1
    },
    {
      "questionId": "1",
      "label": "Do you like coffee?",
      "required": true,
      "order": 1,
      "controlType": "radio",
      "questionGroupId": 1
    },
    {
      "questionId": "2",
      "label": "Choose your favorite type of coffee",
      "options": [
        { "key": "espresso", "value": "Espresso" },
        { "key": "latte", "value": "Latte" }
      ],
      "parentQuestionId": "3",
      "required": true,
      "order": 1,
      "controlType": "checkbox",
      "questionGroupId": 2
    }
  ]
`
    return JSON.parse(json);
  }

  saveAnswers(answers: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, answers);
  }
}
