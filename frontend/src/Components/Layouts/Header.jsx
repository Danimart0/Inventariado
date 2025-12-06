import React from 'react';


const headerStyle = {
    backgroundColor: '#f7912aff',
    color: 'white',
    padding: '20px 24px', // Antes 10px
    textAlign: 'right',
    fontSize: '30px', // Antes 14px
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

function Header({ userName }) {
    return (
        <header style={headerStyle}>
            Le atiende: {userName}
        </header>
    );
}

export default Header;