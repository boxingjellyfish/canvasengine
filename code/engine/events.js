/*
* Handles event queue.
*/
class EventManager {
    constructor() {
        // shift - push
        this.queue = [];
        this.listeners = [];
    }

    register(event) {
        this.queue.push(event);
    }

    dispatch() {
        while (this.queue.length > 0) {
            var event = this.queue.shift();
            for (var i = 0; i < this.listeners.length; i++) {
                this.listeners[i].handle(event);
            }
        }
    }
}

/*
* Base Event
*/
class BaseEvent {
    constructor(name) {
        this.id = Random.UUID();
        this.name = name;
    }
}

/*
* Click Event
*/
class ClickEvent extends BaseEvent {
    constructor(action) {
        super(Events.CLICK);
        this.action = action;
    }
}

/*
* KeyPressed Event
*/
class KeyPressedEvent extends BaseEvent {
    constructor(key) {
        super(Events.KEY_PRESSED);
        this.key = key;
    }
}