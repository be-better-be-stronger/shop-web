import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  categories = [
    'Electronics',
    'Books',
    'Clothing',
    'Food',
    'Laptop'
  ];

  products = [
    {
      id: 1,
      name: 'Laptop Dell XPS',
      price: 25000000,
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 2,
      name: 'iPhone 15',
      price: 22000000,
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 3,
      name: 'Tai nghe Bluetooth',
      price: 1200000,
      image: 'https://via.placeholder.com/300x200',
    },
  ];
}
