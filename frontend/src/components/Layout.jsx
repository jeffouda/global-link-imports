import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="pt-18">
        {children}
      </main>
    </div>
  );
}
