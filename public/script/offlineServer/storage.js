export var storage = new Proxy({}, {
  get(_, prop) { 
    if (typeof prop !== 'string') throw new TypeError('Keys must be strings');
    let value = localStorage.getItem("server_"+prop);
    return value != null ? JSON.parse(value) : undefined 
  },
  set(_, prop, value) { 
    if (typeof prop !== 'string') throw new TypeError('Keys must be strings');
    localStorage.setItem("server_"+prop,JSON.stringify(value)); return true 
  },
  deleteProperty(_, prop) { 
    if (typeof prop !== 'string') throw new TypeError('Keys must be strings');
    localStorage.removeItem("server_"+prop); return true 
  }
});