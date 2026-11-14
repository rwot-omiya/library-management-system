import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BooksQueryDto } from './dto/books-query.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: BooksQueryDto) {
    const { genreId, search, page = 1, limit = 10 } = query;
    const where: Prisma.BookWhereInput = {};

    if (genreId !== undefined) {
      where.genreId = genreId;
    }

    if (search?.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { author: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: { genre: true },
        orderBy: { title: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        pageCount: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });

    if (!book) {
      throw new NotFoundException(`Book ${id} was not found`);
    }

    return book;
  }

  async create(dto: CreateBookDto) {
    const existingBook = await this.prisma.book.findUnique({
      where: { isbn: dto.isbn },
    });
    if (existingBook) {
      throw new ConflictException('A book with this ISBN already exists');
    }

    await this.ensureGenreExists(dto.genreId);

    return this.prisma.book.create({
      data: {
        title: dto.title,
        author: dto.author,
        isbn: dto.isbn,
        totalCopies: dto.totalCopies,
        genreId: dto.genreId,
        available: dto.available ?? dto.totalCopies > 0,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
      },
      include: { genre: true },
    });
  }

  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id);

    if (dto.isbn) {
      const duplicate = await this.prisma.book.findFirst({
        where: { isbn: dto.isbn, NOT: { id } },
      });
      if (duplicate) {
        throw new ConflictException('A book with this ISBN already exists');
      }
    }

    if (dto.genreId !== undefined) {
      await this.ensureGenreExists(dto.genreId);
    }

    return this.prisma.book.update({
      where: { id },
      data: {
        ...dto,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
      },
      include: { genre: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }

  private async ensureGenreExists(genreId: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id: genreId } });
    if (!genre) {
      throw new NotFoundException(`Genre ${genreId} was not found`);
    }
  }
}
