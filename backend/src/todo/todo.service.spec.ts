import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getModelToken } from '@nestjs/mongoose';
import { Todo } from './todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { NotFoundException } from '@nestjs/common';

const mockTodo: Todo = {
  id: '60d21b4667d0d8992e610c85',
  title: 'Test Todo',
  description: 'Description de test',
  status: 'à faire',
};

describe('TodoService', () => {
  let service: TodoService;
  let mockTodoModel: any;

  beforeEach(async () => {
    mockTodoModel = {
      create: jest.fn().mockResolvedValue(mockTodo),

      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockTodo]),
      }),

      findById: jest.fn().mockImplementation((id) => {
        if (id === mockTodo.id) {
          return Promise.resolve(mockTodo);
        }
        return Promise.resolve(null);
      }),

      findByIdAndUpdate: jest.fn().mockImplementation((id, dto) => {
        if (id === mockTodo.id) {
          return Promise.resolve({ ...mockTodo, ...dto });
        }
        return Promise.resolve(null);
      }),

      findByIdAndDelete: jest.fn().mockImplementation((id) => {
        if (id === mockTodo.id) {
          return Promise.resolve(mockTodo);
        }
        return Promise.resolve(null);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getModelToken(Todo.name),
          useValue: mockTodoModel,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const createDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Description',
        status: 'à faire',
      };

      const result = await service.create(createDto);

      expect(result).toEqual(mockTodo);
      expect(mockTodoModel.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should find all todos', async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockTodo]);
      expect(mockTodoModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a todo by its id', async () => {
      const result = await service.findOne(mockTodo.id);

      expect(result).toEqual(mockTodo);
      expect(mockTodoModel.findById).toHaveBeenCalledWith(mockTodo.id);
    });

    it('should throw NotFoundException when the todo does not exist', async () => {
      mockTodoModel.findById.mockResolvedValueOnce(null);

      await expect(service.findOne('inexistant_id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateDto: UpdateTodoDto = {
        title: 'Updated Todo',
        description: 'Updated Desc',
        status: 'en cours',
      };

      const updatedMockTodo = { ...mockTodo, ...updateDto };
      mockTodoModel.findByIdAndUpdate.mockResolvedValueOnce(updatedMockTodo);

      const result = await service.update(mockTodo.id, updateDto);

      expect(result).toEqual(updatedMockTodo);
      expect(mockTodoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTodo.id,
        updateDto,
        { new: true },
      );
    });

    it('should throw NotFoundException when the todo does not exist', async () => {
      const updateDto: UpdateTodoDto = { title: 'Updated' };
      mockTodoModel.findByIdAndUpdate.mockResolvedValueOnce(null);

      await expect(service.update('inexistant_id', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const result = await service.remove(mockTodo.id);

      expect(result).toEqual(mockTodo);
      expect(mockTodoModel.findByIdAndDelete).toHaveBeenCalledWith(mockTodo.id);
    });

    it('should throw NotFoundException when the todo does not exist', async () => {
      mockTodoModel.findByIdAndDelete.mockResolvedValueOnce(null);

      await expect(service.remove('inexistant_id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
