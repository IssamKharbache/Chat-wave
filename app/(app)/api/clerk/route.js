import { createUser } from "@/actions/user";
import { headers } from "next/headers";
import { Webhook } from "svix";

export const POST = async (req) => {
  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error(
      "Please add WEBHOOK_SECRET to your .env file from clerk dashboard"
    );
  }

  //get header

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  //validate signature
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing headers", { status: 400 });
  }

  //get the raw body

  const payload = await req.json();
  const body = JSON.stringify(payload);

  // create a new svix instance
  const wh = new Webhook(webhookSecret);

  let evt;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (error) {
    console.log("Error while verifying web hook", error);
    return new Response("Error while verifying web hook", { status: 400 });
  }
  const eventType = evt.type;
  console.log(`Received ${eventType} event`);

  if (eventType === "user.created") {
    const { id, first_name, last_name, email_addresses, image_url, username } =
      evt.data;
    const email_address = email_addresses[0].email_address;
    try {
      await createUser({
        id,
        first_name,
        last_name,
        email_address,
        image_url,
        username,
      });
      return Response.json({
        message: "User created successfully",
      });
    } catch (error) {
      throw new Error("Failed to create user to data base");
    }
  }
  return Response.json({
    message: "Received event",
  });
};

export const GET = async () => {
  return Response.json({ message: "Hello World" });
};
