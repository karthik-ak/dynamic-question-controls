export class Question {
    questionId!: string;
    label!: string;
    value?: string;
    required!: boolean;
    order!: number;
    controlType!: string;
    parentQuestionId?: string;
    visibleWhen?: boolean;
    cssClass?: string;
    styles?: { [key: string]: string };
    questionGroupId!: number;
  }
  
  export class CheckboxQuestion extends Question { 
    override controlType = 'checkbox';
    options!: { key: string; value: string }[];
  }
  
  export class RadioQuestion extends Question { 
    override controlType = 'radio';
  }
  
  export class ComplexQuestion extends Question { 
    override controlType = 'complex';
    options!: { key: string; value: string }[];
  }
  