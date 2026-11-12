import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  const genres = await Promise.all([
    prisma.genre.create({ data: { name: 'Fiction', description: 'Novels and imaginative stories.' } }),
    prisma.genre.create({ data: { name: 'Science Fiction', description: 'Stories about science, technology, and the future.' } }),
    prisma.genre.create({ data: { name: 'Mystery', description: 'Detective stories and investigations.' } }),
    prisma.genre.create({ data: { name: 'History', description: 'Books about historical events and people.' } }),
  ]);

  const [fiction, scienceFiction, mystery, history] = genres;

  await prisma.book.createMany({
    data: [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780000000001', genreId: fiction.id },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780000000002', genreId: fiction.id },
      { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780000000003', genreId: fiction.id },
      { title: 'The Catcher in the Rye', author: 'J. D. Salinger', isbn: '9780000000004', genreId: fiction.id },
      { title: 'Dune', author: 'Frank Herbert', isbn: '9780000000005', genreId: scienceFiction.id },
      { title: 'Foundation', author: 'Isaac Asimov', isbn: '9780000000006', genreId: scienceFiction.id },
      { title: 'Neuromancer', author: 'William Gibson', isbn: '9780000000007', genreId: scienceFiction.id },
      { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', isbn: '9780000000008', genreId: scienceFiction.id },
      { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', isbn: '9780000000009', genreId: mystery.id },
      { title: 'Murder on the Orient Express', author: 'Agatha Christie', isbn: '9780000000010', genreId: mystery.id },
      { title: 'The Big Sleep', author: 'Raymond Chandler', isbn: '9780000000011', genreId: mystery.id },
      { title: 'Gone Girl', author: 'Gillian Flynn', isbn: '9780000000012', genreId: mystery.id },
      { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780000000013', genreId: history.id },
      { title: 'The Silk Roads', author: 'Peter Frankopan', isbn: '9780000000014', genreId: history.id },
      { title: 'A People’s History of the United States', author: 'Howard Zinn', isbn: '9780000000015', genreId: history.id },
      { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '9780000000016', genreId: history.id },
    ],
  });

  await prisma.user.createMany({
    data: [
      { name: 'Library Patron', email: 'patron@example.com', role: Role.PATRON },
      { name: 'Library Librarian', email: 'librarian@example.com', role: Role.LIBRARIAN },
    ],
  });

  console.log('Seed complete: 4 genres, 16 books, and 2 users inserted.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
