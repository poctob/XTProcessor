import * as Imap from "imap";
import { inspect } from "util";

export class IMAPService {
  private _imap: Imap;

  constructor(private config: Imap.Config) {
    this._imap = new Imap(config);
  }

  public Connect(): void {
    this._imap.once("ready", this.openInbox);
    this._imap.once("error", this.onError);
    this._imap.once("end", this.onDisconnect);
    this._imap.connect();
  }

  public openInbox = () : void => {
    if (this._imap) this._imap.openBox("INBOX", true, this.onInboxOpen);
    else console.log("Imap is null :(");
  }

  private onInboxOpen = (err: Error, mailbox: Imap.Box): void => {
    if (err) throw err;

    let fetch: Imap.ImapFetch = this._imap.seq.fetch("1:1", {
      bodies: "HEADER.FIELDS (FROM TO SUBJECT DATE)",
      struct: true
    });

    fetch.on("message", this.onMessage);
    fetch.once("error", this.onError);
    fetch.once("end", (): void => {
      console.log("Done fetchnig messages");
      this._imap.end();
    });
  }

  private onMessage = (msg: Imap.ImapMessage, seqno: number): void => {
    console.log("Message #%d", seqno);
    let prefix = "(#" + seqno + ") ";

    msg.on("body", this.onBody);
    msg.once("attributes", (attributes): void => {
      console.log(prefix + "Attributes: %s", inspect(attributes, false, 8));
    });
    msg.once("end", (): void => {
      console.log(prefix + "Finished");
    });
  }

  private onBody = (
    stream: NodeJS.ReadableStream,
    info: Imap.ImapMessageBodyInfo
  ): void => {
    let buffer = "";
    stream.on("data", (chunk): void => {
      buffer += chunk.toString("utf8");
    });

    stream.once("end", (): void => {
      console.log("Parsed header: %s", inspect(Imap.parseHeader(buffer)));
    });
  }

  private onError = (err: Error): void => {
    console.log(err);
  }

  private onDisconnect = (): void => {
    console.log("connection closed");
  }

}
