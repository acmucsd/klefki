import Image from "next/image";

export default function Home() {
  return (
    <main className="container">
      <Image width={160} height={160} src="/klefki.png" alt="Klefki" />
      <h1>Klefki</h1>
      <h2>Powerful Serverless Edge Functions</h2>
      <a href="https://www.notion.so/acmucsd/Klefki-0fe442f883ca47fd8050dc9e4eea38f2?pvs=4">
        Learn More
      </a>
    </main>
  );
}
