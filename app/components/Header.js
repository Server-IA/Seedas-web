'use client'; 
import React, { useEffect } from 'react';
import Image from 'next/image';
import { UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

function Header() {
    const headerMenu = [
        {
            id: 2,
            name: 'usuario',
            icon: '/logo-usuario.jpg',
            link: '/indexPage' 
        },
        {
            id: 1,
            name: 'transporta',
            icon: '/logo-carro.jpg',
            link: '/trasportaPage'  
        },
        {
            id: 3,
            name: 'zona de trabajo',
            icon: '/logo-usuario.jpg',
            link: '/zonaTrabajo' 
        }
    ];

    const router = useRouter();
    const { isSignedIn } = useUser();  // Obtiene el estado de autenticación del usuario

    // Redirecciona a '/indexPage' si el usuario está autenticado
    useEffect(() => {
        if (isSignedIn) {
            router.push('/indexPage');
        }
    }, [isSignedIn, router]);

    const handleUserClick = () => {
        if (isSignedIn) {
            router.push('/indexPage');
        } else {
            router.push('/sign-in');
        }
    };

    return (
        <div className='p-5 pb-3 pl-10 border-b-[2px] border-gray-200 flex items-center justify-between' style={{ backgroundColor: '#212626' }}>
            <div className='flex gap-24 items-center'>
                <a href="/indexPage">
                    <Image 
                        src='/LOGO-SEEDAS.jpg'
                        width={70}
                        height={100}
                        alt='logo'
                        className="cursor-pointer"
                    />
                </a>
                <div className='flex gap-6 items-center'>
                    {headerMenu.map((item) => (
                        <button 
                            key={item.id} 
                            className='flex gap-2 items-center bg-212626-900 text-white px-4 py-2 rounded-md cursor-pointer'
                            onClick={() => item.name === 'usuario' ? handleUserClick() : router.push(item.link)}
                        >
                            <Image
                                src={item.icon}
                                width={20}
                                height={20}
                                alt={item.name}
                            />
                            <h2 className='text-[14px] font-medium'>{item.name}</h2>
                        </button>
                    ))}
                </div>
            </div>
            {!isSignedIn && (
            <div className='flex gap-4 ml-auto'>
                <a href="/sign-in">
                    <button className='bg-gray-900 text-white px-8 py-2 rounded-md cursor-pointer'>Iniciar Sesión</button>
                </a>
                <a href="/sign-up">
                    <button className='bg-gray-900 text-white px-4 py-2 rounded-md cursor-pointer mr-4'>Registrarse</button>
                </a>
            </div>
            )}
            <div className="mr-4">
                <UserButton />  
            </div>
        </div>
    );
}

export default Header;