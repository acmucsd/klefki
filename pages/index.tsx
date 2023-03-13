import Image from "next/image";

export default function Home() {
  return (
    <main className="container">
      <Image width={160} height={160} src="/klefke.png" alt="Klefke" />
      <h1>Klefke</h1>
      <h2>Powerful Serverless Edge Functions</h2>
      <a href="https://www.notion.so/acmucsd/Klefke-0fe442f883ca47fd8050dc9e4eea38f2?pvs=4">
        Learn More
      </a>
    </main>
  );
}
