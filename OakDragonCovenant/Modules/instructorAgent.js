const BaseAgent = require('./baseAgent');

class InstructorAgent extends BaseAgent {
    constructor(name) {
        super(name, "Instructor");
        this.lessons = [];
    }

    addLesson(lessonTitle) {
        this.lessons.push(lessonTitle);
        console.log(`${this.name} added lesson: ${lessonTitle}`);
    }

    teachLesson(lessonTitle) {
        if (this.lessons.includes(lessonTitle)) {
            console.log(`${this.name} is teaching: ${lessonTitle}`);
        } else {
            console.log(`${this.name} cannot teach "${lessonTitle}" (lesson not found)`);
        }
    }

    listLessons() {
        console.log(`${this.name} can teach these lessons:`);
        this.lessons.forEach((l, i) => console.log(`${i + 1}. ${l}`));
    }
}

module.exports = InstructorAgent;