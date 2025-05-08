import React from 'react';
import CatalogCarousel from '../components/CatalogCarousel';
import trjSrc from '../assets/trj.svg';
import invSrc from '../assets/inv.svg';
import volSrc from '../assets/vol.svg';

const categories = [
  {
    id: 'papeleria',
    name: 'Papelería Comercial',
    products: [
      {
        id: 1,
        name: 'Tarjetas de Presentación',
        image: trjSrc,
        options: {
          Tamaño: ['9x5 cm', '9x5.5 cm'],
          Cantidad: ['1000', '2000', '5000'],
          Papel: ['Estucado 300gr', 'Estucado 350gr'],
          Impresión: ['1 Cara', '2 Caras'],
          Acabado: ['Mate', 'Brillo']
        }
      }
    ]
  },
  {
    id: 'publicitario',
    name: 'Material Publicitario',
    products: [
      {
        id: 2,
        name: 'Invitaciones',
        image: invSrc,
        options: {
          Tamaño: ['10,5x6 cm', '7x10 cm'],
          Cantidad: ['1000', '2000', '5000'],
          Papel: ['Couché 115gr', 'Couché 150gr', 'Couché 200gr', 'Couché 250gr'],
          Impresión: ['1 Cara', '2 Caras']
        }
      },
      {
        id: 3,
        name: 'Volantes',
        image: volSrc,
        options: {
          Tamaño: ['7x10 cm'],
          Cantidad: ['1000', '5000', '10000'],
          Papel: ['Bond 63gr', 'Bond 75gr'],
          Impresión: ['1 Cara', '2 Caras']
        }
      }
    ]
  }
];

export default function ClientHome() {
  return (
    <div>
      <CatalogCarousel categories={categories} />
    </div>
  );
}
