module.exports = class Message {
    constructor(options = {}) {
        // console.log(new Date(),1)


        this.when = options.when || new Date();

        this.author = options["author"] || "anonymous";

        this.body = options.body || "";

    }
}