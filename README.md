# Packet-Tracer-Monitor
Packet Tracer Monitor is a web-app made to interact via SNMP with GNS3 networks. 
It runs on the host machine. 

Note that the app is currently under development.

Contributions and pull requests are open, starting after April 15, 2025.
Feel free to fork the project and PR on it.

It's a Node app, using Nuxt as a **fullstack framework**.

Learn Nuxt: [Feel free to check the official docs](https://nuxt.com/docs/guide), Nuxt is a really cool framework.

**Versions used**

- Nuxt v3.16 (I'm aware that Nuxt 4 will be released soon, maybe I will consider making the project Nuxt 4 compatible in the future.)
- Tailwind v4.0.17 (Using a Vite plugin, check [this page](https://tailwindcss.com/docs/installation/framework-guides/nuxt) to learn more about it, LLMs are very bad with the latest Tailwind versions.)
- [Net-Snmp v3.20.0](https://www.npmjs.com/package/net-snmp)
- Mongoose v8.13.1 (MongoDB package for Node)

---

## Installation

Clone the repository: 
```zsh
git clone https://www.github.com/Aqu1tain/Packet-Tracer-Monitor.git
```
Next, __navigate into the project folder__, then:
```zsh
npm install
```

__DO NOT FORGET TO EDIT THE .env.example into a .env file, and write the correct data inside.__

And you can run the project:
```zsh
npm run dev
```

Access the app in your browser: http://localhost:3000/login

## License

This project is licensed under the AGPL 3.0 License. All projects using this one must be open-source. Check the [LICENSE](/LICENSE) file to learn more about it.