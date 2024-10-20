import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Question, CheckboxQuestion, RadioQuestion } from '../question.model';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  form: FormGroup;
  questions: Question[] = [];
  visibleQuestions: Question[] = []; // This will hold the questions to display
  radioGroups: { [key: string]: FormGroup } = {}; // Store selected values for radio groups
  
  constructor(private fb: FormBuilder, private questionService: QuestionService) {
    this.form = this.fb.group({
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questions = this.questionService.getQuestions();
      // this.questions = Array.isArray(questions) ? questions : [];
      this.addQuestionsToForm();
      this.filterVisibleQuestions(); // Initialize visible questions
  }

  get questionControls() {
    return this.form.get('questions') as FormArray;
  }

  addQuestionsToForm() {
    this.questions.forEach(question => {
      const control = this.fb.control('');
      this.questionControls.push(control);
      control.valueChanges.subscribe(() => this.onQuestionChange()); // Subscribe to value changes
    });
  }

  onQuestionChange() {
    this.filterVisibleQuestions();
  }

  filterVisibleQuestions() {
    this.visibleQuestions = this.questions.filter(question => {
      if (!question.parentQuestionId) {
        return true; // Always show parent questions
      }

      // Check if the parent question is answered
      const parentQuestion = this.questions.find(q => q.questionId === question.parentQuestionId);
      if (!parentQuestion) {
        return false; // Parent question not found
      }

      const parentControlValue = this.getControlValue(parentQuestion.questionId);

      // Check if parentControlValue is 'Y' or not an empty string
      return parentControlValue === 'Y' || parentControlValue !== '';
    });
  }

  getControlValue(questionId: string): any {
    const index = this.questions.findIndex(q => q.questionId === questionId);
    return index >= 0 ? this.questionControls.at(index).value : null;
  }  

  getOptions(question: Question) {
    if (this.isCheckboxQuestion(question)) {
      return (question as CheckboxQuestion).options;
    }
    return [];
  }

  isCheckboxQuestion(question: Question): question is CheckboxQuestion {
    return (question as CheckboxQuestion).options !== undefined;
  }

  isRadioQuestion(question: Question): question is RadioQuestion {
    return question.controlType === 'radio';
  }


  onSubmit() {
    if (this.form.valid) {
      this.questionService.saveAnswers(this.form.value).subscribe(response => {
        console.log('Form saved successfully', response);
      });
    }
  }
}
