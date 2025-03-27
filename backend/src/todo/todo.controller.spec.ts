import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './todo.schema';
import { NotFoundException } from '@nestjs/common';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  const mockTodo: Todo = {
    id: '60d21b4667d0d8992e610c85',
    title: 'Test Todo',
    description: 'Description de test',
    status: 'à faire',
  };

  const mockTodoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);

    jest.clearAllMocks();

    mockTodoService.create.mockResolvedValue(mockTodo);
    mockTodoService.findAll.mockResolvedValue([mockTodo]);
    mockTodoService.findOne.mockResolvedValue(mockTodo);
    mockTodoService.update.mockResolvedValue(mockTodo);
    mockTodoService.remove.mockResolvedValue(mockTodo);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const dto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Description',
        status: 'à faire',
      };

      expect(await controller.create(dto)).toEqual(mockTodo);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      expect(await controller.findAll()).toEqual([mockTodo]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a todo by its id', async () => {
      expect(await controller.findOne(mockTodo.id)).toEqual(mockTodo);
      expect(service.findOne).toHaveBeenCalledWith(mockTodo.id);
    });

    it('should handle not found errors', async () => {
      mockTodoService.findOne.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const dto: UpdateTodoDto = {
        title: 'Updated Todo',
        description: 'Updated Desc',
        status: 'en cours',
      };

      expect(await controller.update(mockTodo.id, dto)).toEqual(mockTodo);
      expect(service.update).toHaveBeenCalledWith(mockTodo.id, dto);
    });

    it('should handle not found errors', async () => {
      const dto: UpdateTodoDto = { title: 'Updated' };
      mockTodoService.update.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.update('nonexistent', dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      expect(await controller.remove(mockTodo.id)).toEqual(mockTodo);
      expect(service.remove).toHaveBeenCalledWith(mockTodo.id);
    });

    it('should handle not found errors', async () => {
      mockTodoService.remove.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
