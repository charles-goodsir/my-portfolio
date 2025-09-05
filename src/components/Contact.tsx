function Contact() {
  return (
    <section id="contact" className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-semibold mb-4">Contact</h2>
      <p className="mb-2">
        Email:{" "}
        <a
          href="mailto:youremail@example.com"
          className="text-blue-600 hover:underline"
        >
          youremail@example.com
        </a>
      </p>
      <p className="mb-2">
        LinkedIn:{" "}
        <a
          href="https://www.linkedin.com/in/your-profile"
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          your-profile
        </a>
      </p>
      <p>
        GitHub:{" "}
        <a
          href="https://github.com/YOUR-USERNAME"
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          YOUR-USERNAME
        </a>
      </p>
    </section>
  )
}

export default Contact
