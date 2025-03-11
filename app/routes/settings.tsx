import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const durationMinutes = form.get("duration");
  const durationSeconds = parseInt(durationMinutes) * 60;
  const sound = form.get("sound");
  const headers = new Headers();
  headers.set("Set-Cookie", `duration=${durationSeconds}; Path=/; Max-Age=3600`);
  headers.set("Set-Cookie", `sound=${sound}; Path=/; Max-Age=3600`);
  return redirect("/session", { headers });
};

export default function Settings() {
  return (
    <Form method="post">
      <label>
        Duration (minutes):
        <input type="number" name="duration" defaultValue="25" />
      </label>
      <br />
      <label>
        Sound:
        <select name="sound">
          <option value="cafe">Cafe</option>
          <option value="rain">Rain</option>
        </select>
      </label>
      <br />
      <button type="submit">Save</button>
    </Form>
  );
}
