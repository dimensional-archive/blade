const { BladeClient, ListenerStore, MonitorStore } = require("../dist");

const token = 'NzIwNzcwNTU2OTYxNDg4OTY3.XuK0Gg.jxgsYRHNgbxgjpRw7cBgqqWCnMU';

const client = new BladeClient(token);
client
  .use(new ListenerStore(client))
  .use(new MonitorStore(client));

client.start();
