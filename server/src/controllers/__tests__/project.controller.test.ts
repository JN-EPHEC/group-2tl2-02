import { Request, Response } from 'express';

// --- Mocks des modèles ---
const mockUserCreate = jest.fn();
const mockUserFindOne = jest.fn();
const mockUserFindByPk = jest.fn();
const mockUserDestroy = jest.fn();
const mockProjectCreate = jest.fn();
const mockProjectFindAll = jest.fn();
const mockProjectFindByPk = jest.fn();
const mockProjectDestroy = jest.fn();
const mockImageCreate = jest.fn();
const mockComposantCreate = jest.fn();
const mockTacheCreate = jest.fn();
const mockHistoryUpsert = jest.fn();

jest.mock('../../models/lien_inter/index', () => ({
  User: {
    create: (...args: any[]) => mockUserCreate(...args),
    findOne: (...args: any[]) => mockUserFindOne(...args),
    findByPk: (...args: any[]) => mockUserFindByPk(...args),
    destroy: (...args: any[]) => mockUserDestroy(...args),
  },
  Project: {
    create: (...args: any[]) => mockProjectCreate(...args),
    findAll: (...args: any[]) => mockProjectFindAll(...args),
    findByPk: (...args: any[]) => mockProjectFindByPk(...args),
    destroy: (...args: any[]) => mockProjectDestroy(...args),
  },
  Image: {
    create: (...args: any[]) => mockImageCreate(...args),
  },
  video: {},
  Tâche: {
    create: (...args: any[]) => mockTacheCreate(...args),
  },
  Composant: {
    create: (...args: any[]) => mockComposantCreate(...args),
  },
  History: {
    upsert: (...args: any[]) => mockHistoryUpsert(...args),
  },
}));

jest.mock('../../utils/Password', () => ({
  validatePassword: jest.fn().mockReturnValue(true),
  hashPassword: jest.fn().mockResolvedValue('hashed_password'),
  comparePassword: jest.fn().mockResolvedValue(true),
}));

jest.mock('../../utils/emailValidator', () => ({
  isValidEmail: jest.fn().mockReturnValue(true),
}));

import {
  registerUser,
  loginUser,
  deleteUser,
  deleteProject,
  getAllProjects,
  createProject,
  getUserById,
  getProjectById,
  updateUser,
  uploadUserAvatar,
  testUploadFolder,
} from '../projects.controller';

// --- Helpers ---
const mockReq = (body = {}, params = {}): Request =>
  ({ body, params } as unknown as Request);

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

// =====================
// registerUser
// =====================
describe('registerUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('crée un utilisateur et retourne 201', async () => {
    mockUserCreate.mockResolvedValue({
      getDataValue: () => 1,
      email: 'jean@gmail.com',
    });
    const req = mockReq({ firstName: 'Jean', lastName: 'Dupont', email: 'jean@gmail.com', password: 'Pass123!', pseudo: 'jeanD', age: '25', bio: '' });
    const res = mockRes();
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Utilisateur créé avec succès !' }));
  });

  it('retourne 400 si email invalide', async () => {
    const { isValidEmail } = require('../../utils/emailValidator');
    isValidEmail.mockReturnValueOnce(false);
    const req = mockReq({ email: 'bademail', password: 'Pass123!', age: '25' });
    const res = mockRes();
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retourne 400 si mot de passe invalide', async () => {
    const { validatePassword } = require('../../utils/Password');
    validatePassword.mockReturnValueOnce(false);
    const req = mockReq({ email: 'jean@gmail.com', password: '123', age: '25' });
    const res = mockRes();
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retourne 500 si erreur DB', async () => {
    mockUserCreate.mockRejectedValue(new Error('DB error'));
    const req = mockReq({ email: 'jean@gmail.com', password: 'Pass123!', age: '25' });
    const res = mockRes();
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// =====================
// loginUser
// =====================
describe('loginUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('connecte un utilisateur et retourne 200', async () => {
    mockUserFindOne.mockResolvedValue({ firstName: 'Jean', Uid: 1, email: 'jean@gmail.com', password: 'hashed' });
    const req = mockReq({ email: 'jean@gmail.com', password: 'Pass123!' });
    const res = mockRes();
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Bienvenue Jean !' }));
  });

  it('retourne 401 si utilisateur non trouvé', async () => {
    mockUserFindOne.mockResolvedValue(null);
    const req = mockReq({ email: 'jean@gmail.com', password: 'Pass123!' });
    const res = mockRes();
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('retourne 401 si mot de passe incorrect', async () => {
    mockUserFindOne.mockResolvedValue({ firstName: 'Jean', password: 'hashed' });
    const { comparePassword } = require('../../utils/Password');
    comparePassword.mockResolvedValueOnce(false);
    const req = mockReq({ email: 'jean@gmail.com', password: 'wrong' });
    const res = mockRes();
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('retourne 400 si email invalide', async () => {
    const { isValidEmail } = require('../../utils/emailValidator');
    isValidEmail.mockReturnValueOnce(false);
    const req = mockReq({ email: 'bademail', password: 'Pass123!' });
    const res = mockRes();
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retourne 500 si erreur DB', async () => {
    mockUserFindOne.mockRejectedValue(new Error('DB error'));
    const req = mockReq({ email: 'jean@gmail.com', password: 'Pass123!' });
    const res = mockRes();
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// =====================
// deleteUser
// =====================
describe('deleteUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('supprime un utilisateur et retourne 200', async () => {
    mockUserDestroy.mockResolvedValue(1);
    const req = mockReq({}, { id: '1' });
    const res = mockRes();
    await deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('retourne 404 si utilisateur non trouvé', async () => {
    mockUserDestroy.mockResolvedValue(0);
    const req = mockReq({}, { id: '999' });
    const res = mockRes();
    await deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('retourne 500 si erreur DB', async () => {
    mockUserDestroy.mockRejectedValue(new Error('DB error'));
    const req = mockReq({}, { id: '1' });
    const res = mockRes();
    await deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// =====================
// deleteProject
// =====================
describe('deleteProject', () => {
  beforeEach(() => jest.clearAllMocks());

  it('supprime un projet et retourne 200', async () => {
    mockProjectDestroy.mockResolvedValue(1);
    const req = mockReq({}, { id: '1' });
    const res = mockRes();
    await deleteProject(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('retourne 404 si projet non trouvé', async () => {
    mockProjectDestroy.mockResolvedValue(0);
    const req = mockReq({}, { id: '999' });
    const res = mockRes();
    await deleteProject(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('retourne 500 si erreur DB', async () => {
    mockProjectDestroy.mockRejectedValue(new Error('DB error'));
    const req = mockReq({}, { id: '1' });
    const res = mockRes();
    await deleteProject(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// =====================
// getAllProjects
// =====================
describe('getAllProjects', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retourne 200 avec la liste des projets', async () => {
    mockProjectFindAll.mockResolvedValue([{ id: 1, title: 'Robot Arduino' }]);
    const req = mockReq();
    const res = mockRes();
    await getAllProjects(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('retourne 500 si erreur DB', async () => {
    mockProjectFindAll.mockRejectedValue(new Error('DB error'));
    const req = mockReq();
    const res = mockRes();
    await getAllProjects(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// =====================
// createProject
// =====================
describe('createProject', () => {
  beforeEach(() => jest.clearAllMocks());

  it('crée un projet et retourne 201', async () => {
    const fakeProject = { id: 1, title: 'Robot', addImage: jest.fn(), addAuteurs: jest.fn(), addFavoris: jest.fn() };
    mockProjectCreate.mockResolvedValue(fakeProject);
    const req = mockReq({ title: 'Robot', date: '2024-01-15', isPublic: true });
    const res = mockRes();
    await createProject(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('crée un projet avec upload fichier', async () => {
    const fakeProject = { id: 1, title: 'Robot', addImage: jest.fn(), addAuteurs: jest.fn(), addVideo: jest.fn(), addComposant: jest.fn(), addTâche: jest.fn() };
    mockProjectCreate.mockResolvedValue(fakeProject);
    mockUserFindByPk.mockResolvedValue({ addAuteurs: fakeProject.addAuteurs });
    mockImageCreate.mockResolvedValue({ I_id: 1 });
    const req = mockReq({ title: 'Robot', date: '2024-01-15', Uid: 1, VId: 2, composants: [{ nom: 'Pièce 1' }], etapes: [{ titre: 'Étape 1', description: 'Faire ceci' }] });
    (req as any).file = { filename: 'robot.jpg', originalname: 'robot.jpg' };
    const res = mockRes();
    await createProject(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(fakeProject.addImage).toHaveBeenCalled();
    expect(fakeProject.addAuteurs).toHaveBeenCalled();
    expect(fakeProject.addVideo).toHaveBeenCalled();
    expect(fakeProject.addComposant).toHaveBeenCalled();
    expect(fakeProject.addTâche).toHaveBeenCalled();
  });

  it('crée un projet avec URL image', async () => {
    const fakeProject = { id: 1, title: 'Robot', addImage: jest.fn(), addAuteurs: jest.fn() };
    mockProjectCreate.mockResolvedValue(fakeProject);
    mockUserFindByPk.mockResolvedValue({ addAuteurs: fakeProject.addAuteurs });
    mockImageCreate.mockResolvedValue({ I_id: 1 });
    const req = mockReq({ title: 'Robot', date: '2024-01-15', imageUrl: 'http://example.com/image.jpg', Uid: 5 });
    const res = mockRes();
    await createProject(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(fakeProject.addImage).toHaveBeenCalled();
    expect(fakeProject.addAuteurs).toHaveBeenCalled();
  });

  it('retourne 500 si erreur DB', async () => {
    mockProjectCreate.mockRejectedValue(new Error('DB error'));
    const req = mockReq({ title: 'Robot', date: '2024-01-15' });
    const res = mockRes();
    await createProject(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// =====================
// getUserById
// =====================
describe('getUserById', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retourne 200 avec l utilisateur et ses stats', async () => {
    mockUserFindByPk.mockResolvedValue({
      get: jest.fn().mockReturnValue({ Uid: 1, pseudo: 'jeanD' }),
      countAuteurs: jest.fn().mockResolvedValue(2),
      countFavoris: jest.fn().mockResolvedValue(3),
      countBadge: jest.fn().mockResolvedValue(1),
    });
    const req = mockReq({}, { id: '1' });
    const res = mockRes();
    await getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('retourne 404 si utilisateur non trouvé', async () => {
    mockUserFindByPk.mockResolvedValue(null);
    const req = mockReq({}, { id: '999' });
    const res = mockRes();
    await getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('retourne 500 si erreur DB', async () => {
    mockUserFindByPk.mockRejectedValue(new Error('DB error'));
    const req = mockReq({}, { id: '1' });
    const res = mockRes();
    await getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// =====================
// getProjectById
// =====================
describe('getProjectById', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retourne 200 avec le projet', async () => {
    mockProjectFindByPk.mockResolvedValue({ id: 1, title: 'Robot Arduino' });
    const req = mockReq({}, { id: '1' });
    const res = mockRes();
    await getProjectById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('retourne 404 si projet non trouvé', async () => {
    mockProjectFindByPk.mockResolvedValue(null);
    const req = mockReq({}, { id: '999' });
    const res = mockRes();
    await getProjectById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('retourne 500 si erreur DB', async () => {
    mockProjectFindByPk.mockRejectedValue(new Error('DB error'));
    const req = mockReq({}, { id: '1' });
    const res = mockRes();
    await getProjectById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});


// =====================
// updateUser
// =====================
describe('updateUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('met à jour un utilisateur et retourne 200', async () => {
    const mockUser = {
      Uid: 1,
      pseudo: 'jeanD',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@gmail.com',
      bio: 'Mon bio',
      age: 25,
      update: jest.fn().mockResolvedValue({}),
    };
    mockUserFindByPk.mockResolvedValue(mockUser);
    const req = mockReq({ firstName: 'Jean Updated', email: 'jean.updated@gmail.com' }, { id: '1' });
    const res = mockRes();
    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockUser.update).toHaveBeenCalled();
  });

  it('met à jour le mot de passe avec validation', async () => {
    const mockUser = {
      Uid: 1,
      pseudo: 'jeanD',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@gmail.com',
      bio: 'Mon bio',
      age: 25,
      update: jest.fn().mockResolvedValue({}),
    };
    mockUserFindByPk.mockResolvedValue(mockUser);
    const req = mockReq({ password: 'NewPass123!' }, { id: '1' });
    const res = mockRes();
    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockUser.update).toHaveBeenCalled();
  });

  it('retourne 400 si email invalide', async () => {
    const mockUser = {
      Uid: 1,
      age: 25,
      update: jest.fn(),
    };
    mockUserFindByPk.mockResolvedValue(mockUser);
    const { isValidEmail } = require('../../utils/emailValidator');
    isValidEmail.mockReturnValueOnce(false);
    const req = mockReq({ email: 'bademail' }, { id: '1' });
    const res = mockRes();
    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retourne 400 si mot de passe invalide', async () => {
    const mockUser = {
      Uid: 1,
      age: 25,
      update: jest.fn(),
    };
    mockUserFindByPk.mockResolvedValue(mockUser);
    const { validatePassword } = require('../../utils/Password');
    validatePassword.mockReturnValueOnce(false);
    const req = mockReq({ password: '123' }, { id: '1' });
    const res = mockRes();
    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retourne 404 si utilisateur non trouvé', async () => {
    mockUserFindByPk.mockResolvedValue(null);
    const req = mockReq({ firstName: 'Jean' }, { id: '999' });
    const res = mockRes();
    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('retourne 500 si erreur DB', async () => {
    mockUserFindByPk.mockRejectedValue(new Error('DB error'));
    const req = mockReq({ firstName: 'Jean' }, { id: '1' });
    const res = mockRes();
    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// =====================
// uploadUserAvatar
// =====================
describe('uploadUserAvatar', () => {
  beforeEach(() => jest.clearAllMocks());

  it('upload l\'avatar d\'un utilisateur avec fichier et retourne 201', async () => {
    const mockUser = { Uid: 1, addAvatar: jest.fn().mockResolvedValue({}) };
    mockUserFindByPk.mockResolvedValue(mockUser);
    mockImageCreate.mockResolvedValue({ I_id: 1, I_img: '/uploads/images/avatar.jpg', I_url: 'http://localhost:3000/uploads/images/avatar.jpg' });
    const req = mockReq({}, { id: '1' });
    (req as any).file = { filename: 'avatar.jpg', originalname: 'avatar.jpg' };
    const res = mockRes();
    await uploadUserAvatar(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(mockUser.addAvatar).toHaveBeenCalled();
  });

  it('retourne 400 si aucun fichier fourni', async () => {
    const mockUser = { Uid: 1 };
    mockUserFindByPk.mockResolvedValue(mockUser);
    const req = mockReq({}, { id: '1' });
    const res = mockRes();
    await uploadUserAvatar(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retourne 404 si utilisateur non trouvé', async () => {
    mockUserFindByPk.mockResolvedValue(null);
    const req = mockReq({}, { id: '999' });
    (req as any).file = { filename: 'avatar.jpg', originalname: 'avatar.jpg' };
    const res = mockRes();
    await uploadUserAvatar(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('retourne 500 si erreur DB', async () => {
    mockUserFindByPk.mockRejectedValue(new Error('DB error'));
    const req = mockReq({}, { id: '1' });
    (req as any).file = { filename: 'avatar.jpg', originalname: 'avatar.jpg' };
    const res = mockRes();
    await uploadUserAvatar(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// =====================
// testUploadFolder
// =====================
describe('testUploadFolder', () => {
  beforeEach(() => jest.clearAllMocks());

  it('teste le dossier uploads et retourne 200', async () => {
    const req = mockReq();
    const res = mockRes();
    await testUploadFolder(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Test du dossier uploads réussi',
      folderExists: expect.any(Boolean),
    }));
  });

  it('retourne 500 si erreur lors du test', async () => {
    const req = mockReq();
    const res = mockRes();
    jest.spyOn(require('fs'), 'existsSync').mockImplementationOnce(() => {
      throw new Error('FS error');
    });
    await testUploadFolder(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});