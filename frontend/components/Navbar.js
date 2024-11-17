import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.navLinks}>
        <Link href="/" style={styles.link}>Home</Link>
        <Link href="/customers/add" style={styles.link}>Add Customer</Link>
        <Link href="/customers/view" style={styles.link}>View Customers</Link>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15px 0',
    background: 'linear-gradient(to right, #4CAF50, #45a049)', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  navLinks: {
    display: 'flex',
    gap: '30px',
    fontSize: '18px',
    fontWeight: '500',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
    transition: 'color 0.3s, transform 0.3s', 
  },
  linkHover: {
    color: '#ffeb3b', 
    transform: 'scale(1.1)', 
  },
};

