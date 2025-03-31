# Packet-Tracer-Monitorer
Packet Tracer Monitorer is a web-app made to interact via SNMP with GNS3 networks. 
It runs on the host machine. 

Note that the app is currently under development.

Contributions and pull requests are open, starting after april 15, 2025
Feel free to fork the project, and pr on it.

It's a node app, using Nuxt as a **fullstack framework**.

Learn Nuxt : [Feel free to check the official docs](https://nuxt.com/docs/guide), nuxt is a really cool framework.

**Versions used**

- Nuxt v3.16 (I'm aware that Nuxt 4 is soon released, maybe i will think to make the project Nuxt 4 compatible in the future.)
- Tailwind v4.0.17 (Using a vite plugin, check [this page](https://tailwindcss.com/docs/installation/framework-guides/nuxt) to learn more about it, llms are very bad with the lasts tailwind versions.)
- [Net-Snmp v3.20.0](https://www.npmjs.com/package/net-snmp)
- Mongoose v8.13.1 (MongoDb package for Node)

---

## Installation

clone the repository : 
```zsh
git clone https://www.github.com/Aqu1tain/Packet-Tracer-Monitor.git
```
next, __navigate into the folder project__, then : 
```zsh
npm install
```

__DO NOT FORGET TO EDIT THE .env.example into a .env file, and write the correct data inside.__

and you can run the project : 
```zsh
npm run dev
```

Access the app in your browser : http://localhost:3000/login