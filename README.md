[![npm](https://img.shields.io/npm/dm/timen?style=flat-square)](https://www.npmjs.com/package/timen)

Time Manager
====
Simple time manager based on `requestAnimationFrame`.

## Installation

`yarn add timen` or `npm i timen`

## Usage

```js
import Time from 'timen';

// Create time scope
const timers = Time.create();
const now = new Date();

const sayHello = () => console.log('hello');

// Subscribe at time
timers.at(now.setMinutes(now.getMinutes() + 1), sayHello);

// Subscribe at "after N ms" (same as setTimeout)
timers.after(1000, sayHello);

// Subscribe at "every N ms" (same as setInterval)
timers.every(1000, sayHello);

// Subscribe at "next tick"
timers.nextTick(sayHello);

// Subscribe at "every next tick"
const unsubscribeIt = timers.tick(sayHello);
// Unsubscribe certain callback
unsubscribeIt();

// Unsubscribe specifyed callback
timers.clear(sayHello);

// Clear all timers in scope
timers.clear();
```
