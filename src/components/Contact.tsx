function Contact() {
  return (
    <section id="contact" className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-semibold mb-4">Contact</h2>
      <p className="mb-2">
        Email:{' '}
        <a
          href="goodsirces@gmail.com"
          className="text-blue-600 hover:underline"
        >
          goodsirces@gmail.com
        </a>
      </p>
      <p className="mb-2">
        LinkedIn:{' '}
        <a
          href="www.linkedin.com/in/charles-goodsir-430b0b254"
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          Charles Goodsir
        </a>
      </p>
      <p>
        GitHub:{' '}
        <a
          href="https://github.com/charles-goodsir"
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          charles-goodsir
        </a>
      </p>
    </section>
  )
}

export default Contact
