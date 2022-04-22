Teacher.create(name: 'Teacher',email: 'teacher@example.com', password: '12345678')
Test.create(name: 'test1',description: 'description 1')
Question.create(test_id: 1, label: 'label2',description: 'q description 2')
Option.create(question_id: 1, title: 'title2',is_correct: false)