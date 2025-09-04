// src/app/services/employee.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Employee {
  id?: number;
  nama: string;
  no_kad: string;
  emel: string;
  skim_khidmat: string;
  gred_hakiki: string;
  unit: string;
  nama_jawatan_sekarang: string;
  gred_jawatan_sekarang: string;
  tempat_bertugas: string;
  tarikh_mula_kontrak: Date | null;
  tarikh_akhir_kontrak: Date | null;
  created_at?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private storageKey = 'employees';
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$ = this.employeesSubject.asObservable();

  constructor() {
    this.loadEmployees();
  }

  // Load employees from localStorage
  private loadEmployees(): void {
    const stored = localStorage.getItem(this.storageKey);
    const employees = stored ? JSON.parse(stored, this.dateReviver) : [];
    this.employeesSubject.next(employees);
  }

  // Save employees to localStorage
  private saveEmployees(employees: Employee[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(employees));
    this.employeesSubject.next(employees);
  }

  // Date reviver for JSON.parse to handle Date objects
  private dateReviver(key: string, value: any): any {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return new Date(value);
    }
    return value;
  }

  // Get all employees
  getEmployees(): Observable<Employee[]> {
    return this.employees$;
  }

  // Get current employees array
  getCurrentEmployees(): Employee[] {
    return this.employeesSubject.value;
  }

  // Add new employee
  addEmployee(employee: Employee): Observable<Employee> {
    return new Observable(observer => {
      const employees = this.getCurrentEmployees();
      const newEmployee: Employee = {
        ...employee,
        id: Date.now(), // Simple ID generation
        created_at: new Date()
      };
      
      employees.push(newEmployee);
      this.saveEmployees(employees);
      
      observer.next(newEmployee);
      observer.complete();
    });
  }

  // Update employee
  updateEmployee(id: number, updatedEmployee: Employee): Observable<Employee> {
    return new Observable(observer => {
      const employees = this.getCurrentEmployees();
      const index = employees.findIndex(emp => emp.id === id);
      
      if (index > -1) {
        employees[index] = { ...updatedEmployee, id };
        this.saveEmployees(employees);
        observer.next(employees[index]);
      } else {
        observer.error('Employee not found');
      }
      observer.complete();
    });
  }

  // Delete employee
  deleteEmployee(id: number): Observable<void> {
    return new Observable(observer => {
      const employees = this.getCurrentEmployees().filter(emp => emp.id !== id);
      this.saveEmployees(employees);
      observer.next();
      observer.complete();
    });
  }

  // Get employee by ID
  getEmployeeById(id: number): Observable<Employee | undefined> {
    return new Observable(observer => {
      const employee = this.getCurrentEmployees().find(emp => emp.id === id);
      observer.next(employee);
      observer.complete();
    });
  }

  // Search employees
  searchEmployees(searchTerm: string): Observable<Employee[]> {
    return new Observable(observer => {
      const employees = this.getCurrentEmployees();
      const filtered = employees.filter(emp => 
        emp.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.no_kad.includes(searchTerm) ||
        emp.emel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.unit.toLowerCase().includes(searchTerm.toLowerCase())
      );
      observer.next(filtered);
      observer.complete();
    });
  }

  // Get employees count
  getEmployeesCount(): Observable<number> {
    return new Observable(observer => {
      observer.next(this.getCurrentEmployees().length);
      observer.complete();
    });
  }
}