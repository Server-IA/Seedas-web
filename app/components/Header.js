import React from 'react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';

function Header() {
    const headerMenu = [
        {
            id: 1,
            name: 'transporta',
            icon: '/logo-carro.jpg'
        },
        {
            id: 2,
            name: 'usuario',
            icon: '/logo-usuario.jpg'
        }
    ];

    return (
        <div className='p-5 pb-3 pl-10 border-b-[2px] border-gray-200 flex items-center justify-between' style={{ backgroundColor: '#212626' }}>
            <div className='flex gap-24 items-center'>
                <Image
                    src='/LOGO-SEEDAS.jpg'
                    width={70}
                    height={100}
                    alt='logo'
                />
                <div className='flex gap-6 items-center'>
                    {headerMenu.map((item) => (
                        <div className='flex gap-2 items-center' key={item.id}>
                            <Image
                                src={item.icon}
                                width={20}
                                height={20}
                            />
                            <h2 className='text-[14px] font-medium'>{item.name}</h2>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex gap-4'>
            <a href="/sign-in">
                <button className='bg-gray-900 text-white px-4 py-2 rounded-md cursor-pointer'>Iniciar Sesión</button>
                </a>
                <a href="/sign-up">
                <button className='bg-gray-900 text-white px-4 py-2 rounded-md cursor-pointer'>Registrarse</button>
                    </a>
            </div>
            <UserButton />
        </div>
    );
}

export default Header;
