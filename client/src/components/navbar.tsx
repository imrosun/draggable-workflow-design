import React from 'react';

interface NavbarProps {
    title: string;
    onBack: () => void;
    onSave: () => void;
    onSettings: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ title, onBack, onSave, onSettings }) => {
    return (
        <nav className="flex justify-between items-center bg-gray-700 text-white p-4">
            <div className="flex items-center">
                <button
                    onClick={onBack}
                    className="self-start mr-4 bg-gray-500 text-white px-2 rounded hover:bg-gray-600"
                >
                    Back
                </button>
                <h1>{title}</h1>
            </div>

            <div className="flex items-center">
                <button onClick={onSave} className="mr-4">
                    💾 Save
                </button>
                <button onClick={onSettings}>
                    ⚙️ Settings
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
