'use client';  
import React, { useEffect, useState } from 'react';  
import Image from 'next/image';  
import { UserButton, useUser } from '@clerk/nextjs';  
import { useRouter } from 'next/navigation';  

function Header() {  
    const [headerColor, setHeaderColor] = useState('#212626');  
    const router = useRouter();  
    const { isSignedIn } = useUser();  

    const headerMenu = [  
        { id: 2, name: 'PRODUCTOR', icon: '/feo.jpg', link: '/indexPage', alt: 'Logo productor' },  
        { id: 1, name: 'TRANSPORTADOR', icon: '/logov.jpg', link: '/trasportaPage', alt: 'Logo transportador' },  
        { id: 3, name: 'ZONA DE TRABAJO', icon: '/logozonaTrabajo.jpg', link: '/zonaTrabajo', alt: 'Logo zona de trabajo' }  
    ];  

    useEffect(() => {  
        if (isSignedIn) {  
            router.push('/indexPage');  
        }  
    }, [isSignedIn, router]);  

    const handleButtonClick = (name) => {  
        if (name === 'TRANSPORTADOR') {  
            setHeaderColor('#000E25');  
        } else {  
            setHeaderColor('#212626');  
        }  
        router.push(headerMenu.find(item => item.name === name).link);  
    };  

    return (  
        <header  
            className={`p-4 md:p-5 border-b-[2px] border-gray-200`}  
            style={{ backgroundColor: headerColor }}  
        >  
            <div className="container mx-auto flex flex-wrap items-center justify-between">  
                {/* Logo Section */}  
                <a href="/indexPage" className="flex items-center gap-2">  
                    <Image  
                        src="/LOGO-SEEDAS.jpg"  
                        width={50}  
                        height={70}  
                        alt="Logo SEEDAS"  
                        className="cursor-pointer rounded-md"  
                    />  
                    <span className="text-white text-lg font-semibold hidden md:block">SEEDAS</span>  
                </a>  

                {/* Menu Section */}  
                <nav className="flex flex-wrap gap-4 md:gap-6 items-center">  
                    {headerMenu.map((item) => (  
                        <button  
                            key={item.id}  
                            className="flex gap-2 items-center bg-transparent text-white px-2 md:px-4 py-2 rounded-md hover:bg-gray-800 transition"  
                            onClick={() => handleButtonClick(item.name)}  
                        >  
                            <Image  
                                src={item.icon}  
                                width={20}  
                                height={20}  
                                alt={`Icono de ${item.name}`}  
                                className="rounded-full"  
                            />  
                            <span className="text-sm md:text-base font-medium">{item.name}</span>  
                        </button>  
                    ))}  
                </nav>  

                {/* User Section */}  
                <div className="flex items-center gap-2 md:gap-4">  
                    {!isSignedIn && (  
                        <div className="flex gap-2 md:gap-4">  
                            <a href="/sign-in" className="hidden sm:block">  
                                <button className="bg-gray-900 text-white px-4 py-2 rounded-md">Iniciar Sesión</button>  
                            </a>  
                            <a href="/sign-up" className="hidden sm:block">  
                                <button className="bg-gray-900 text-white px-4 py-2 rounded-md">Registrarse</button>  
                            </a>  
                        </div>  
                    )}  
                    <UserButton />  
                </div>  
            </div>  
        </header>  
    );  
}  

export default Header;  
