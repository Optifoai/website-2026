import React from 'react';

function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem', marginTop: 'auto', borderTop: '1px solid #444', width: '100%' }}>
      <p>&copy; {new Date().getFullYear()} My Auth App. All rights reserved.</p>
    </footer>
  );
}

export default Footer;