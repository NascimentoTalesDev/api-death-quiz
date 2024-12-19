import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    async onModuleInit() {
        try {
            await this.$connect();
            console.log("Connected to the database successfully");
        } catch (error) {
            console.error("Database connection failed:", error);
        }
    }

    async onModuleDestroy() {
        try {
            await this.$disconnect();
            console.log("Disconnected from the database successfully");
        } catch (error) {
            console.error("Failed to disconnect from the database:", error);
        }
    }
}
