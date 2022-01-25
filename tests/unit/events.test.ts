import { Events, EventsApi, SubscriberRemoveHandler } from "../../src/Events";


describe("Events Class", () => {
  const instance = new Events();
  it("should instanciate Events", () => {
    expect(instance).toBeDefined();
  });
  it("should register a new event", () => {
    const subscription = instance.on("change", (v: string) => v);
    expect(subscription).toBeDefined();
  });
  it("should register a new event that run once", () => {
    const subscription = instance.once("once:change", (v: string) => v);
    expect(subscription).toBeDefined();
  });
  it("should emit one-time event once", () => {
    instance.emit("once:change", "emitted-once");
    expect(
      instance.listRegisteredEvents().some((s) => {
        const [key] = s;
        return key === "once:change";
      })
    ).toBeFalsy();
  });
  it("should emit the event", () => {
    instance.emit("change", "passed");
    expect(
      instance.listSubscribersForEvent("change").some((s) => {
        const [id, body] = s;
        return body.counter === 1;
      })
    ).toBeTruthy();
  });
  it("should delete the event via token", () => {
    const [token] = instance.listSubscribersForEvent("change")[0];
    instance.off("change", token);
    expect(
      instance.listRegisteredEvents().some((s) => {
        const [key] = s;
        return key === "change";
      })
    ).toBeFalsy();
  });
  it("should delete then event via handler", () => {
    const handler: SubscriberRemoveHandler = instance.on("change", (v) => v)
    instance.emit("change", 1);
    handler.remove();
    expect(
      instance.listRegisteredEvents().some((s) => {
        const [key] = s;
        return key === "change";
      })
    ).toBeFalsy();    
  })
  it("should run exactly 2 times with the method exactly", () => {
    instance.exactly("change", (v) => v, 2);
    instance.emit("change", 1);
    instance.emit("change", 2);
    instance.emit("change", 3);
    expect(
      instance.listRegisteredEvents().some((s) => {
        const [key] = s;
        return key === "change";
      })
    ).toBeFalsy();
  });
});
