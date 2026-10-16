"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function QuoteForm() {
  const [name, setName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState("");
  const [jobType, setJobType] = useState("Roof repair");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const box = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border: "1px solid #ccd6e0",
    borderRadius: "9px",
    fontSize: "16px"
  };

  async function sendEnquiry(e) {
    e.preventDefault();
    setSending(true);
    setMessage("");

    const { error } = await supabase.from("leads").insert({
      name,
      postcode,
      phone,
      job_type: jobType,
      description
    });

    if (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
      setSending(false);
      return;
    }

    setMessage("Thanks — your roofing enquiry has been received.");
    setName("");
    setPostcode("");
    setPhone("");
    setJobType("Roof repair");
    setDescription("");
    setSending(false);
  }

  return (
    <form onSubmit={sendEnquiry} style={{ display: "grid", gap: "13px" }}>
      <input
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={box}
      />

      <input
        required
        placeholder="London postcode"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
        style={box}
      />

      <input
        required
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={box}
      />

      <select
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
        style={box}
      >
        <option>Roof repair</option>
        <option>Roof leak</option>
        <option>New roof</option>
        <option>Flat roof</option>
        <option>Guttering</option>
        <option>Chimney work</option>
        <option>Other roofing work</option>
      </select>

      <textarea
        required
        rows="6"
        placeholder="Tell us about the roofing work you need"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={box}
      />

      <button
        type="submit"
        disabled={sending}
        style={{
          background: "#0b1f33",
          color: "white",
          border: 0,
          padding: "16px",
          borderRadius: "9px",
          fontSize: "17px",
          fontWeight: "bold"
        }}
      >
        {sending ? "Sending..." : "Send Roofing Enquiry"}
      </button>

      {message && (
        <p style={{ fontWeight: "bold", fontSize: "17px" }}>
          {message}
        </p>
      )}
    </form>
  );
}
