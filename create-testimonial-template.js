const XLSX = require('xlsx');
const path = require('path');

// Create a new workbook
const wb = XLSX.utils.book_new();

// Create data for the template with headers and sample data
const data = [
  {
    'First Name': '',
    'Last Name': '',
    'Location (City, State)': '',
    'Ministry/Group': '',
    'Member Since': '',
    'Your Testimonial (Detailed)': '',
    'Testimonial Summary (1-2 sentences for website)': '',
    'Email (optional)': '',
    'Phone (optional)': ''
  }
];

// Create worksheet
const ws = XLSX.utils.json_to_sheet(data);

// Set column widths
ws['!cols'] = [
  { wch: 15 },
  { wch: 15 },
  { wch: 25 },
  { wch: 30 },
  { wch: 20 },
  { wch: 50 },
  { wch: 50 },
  { wch: 20 },
  { wch: 20 }
];

// Add the sheet to the workbook
XLSX.utils.book_append_sheet(wb, ws, 'Testimonials');

// Write the workbook
XLSX.writeFile(wb, 'Testimonial-Collection-Template.xlsx');
console.log('✓ Testimonial collection template created: Testimonial-Collection-Template.xlsx');
