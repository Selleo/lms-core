import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { AdminAiThreadsRepository } from "src/ai/repositories/admin-ai-threads.repository";
import { FileService } from "src/file/file.service";

import type { AdminAiThreadPagination, AdminAiThreadQuery } from "src/ai/admin-ai-threads.schema";

@Injectable()
export class AdminAiThreadsService {
  constructor(
    private readonly repository: AdminAiThreadsRepository,
    private readonly fileService: FileService,
  ) {}

  async list(query: AdminAiThreadQuery) {
    if (query.from && query.to && new Date(query.from) >= new Date(query.to)) {
      throw new BadRequestException("The end date must follow the start date");
    }
    const result = await this.repository.list(query);
    const references = [
      ...new Set(
        result.data
          .map((thread) => thread.owner.avatarReference)
          .filter((reference): reference is string => Boolean(reference)),
      ),
    ];
    const pictures = new Map(
      await Promise.all(
        references.map(
          async (reference) => [reference, await this.fileService.getFileUrl(reference)] as const,
        ),
      ),
    );
    return {
      ...result,
      data: result.data.map(({ owner, ...thread }) => ({
        ...thread,
        owner: {
          id: owner.id,
          firstName: owner.firstName,
          lastName: owner.lastName,
          profilePictureUrl: owner.avatarReference
            ? (pictures.get(owner.avatarReference) ?? null)
            : null,
        },
      })),
    };
  }

  async get(id: string, query: AdminAiThreadQuery = {}) {
    const thread = await this.repository.find(id, query);
    if (!thread) throw new NotFoundException("Conversation not found");
    const { owner, ...metadata } = thread;
    return {
      ...metadata,
      owner: {
        id: owner.id,
        firstName: owner.firstName,
        lastName: owner.lastName,
        profilePictureUrl: owner.avatarReference
          ? await this.fileService.getFileUrl(owner.avatarReference)
          : null,
      },
      evaluation: await this.repository.evaluation(id),
    };
  }

  async messages(id: string, query: AdminAiThreadPagination) {
    if (!(await this.repository.find(id))) throw new NotFoundException("Conversation not found");
    return this.repository.messages(id, query.page, query.perPage);
  }
}
