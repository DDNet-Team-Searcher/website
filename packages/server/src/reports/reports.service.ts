import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Report } from '@app/shared/types/Report.type';

@Injectable()
export class ReportsService {
    constructor(public readonly prismaService: PrismaService) {}

    async report(
        reportedUserId: number,
        authorId: number,
        reason: string,
    ): Promise<void> {
        await this.prismaService.report.create({
            data: {
                reportedUserId,
                authorId,
                report: reason,
            },
        });
    }

    async isReported(
        reportedUserId: number,
        authorId: number,
    ): Promise<boolean> {
        const res = await this.prismaService.report.findFirst({
            where: {
                authorId,
                reportedUserId,
            },
        });

        return res === null ? false : true;
    }

    async reports(query?: string): Promise<Report[]> {
        const reports = await this.prismaService.report.findMany({
            where: {
                OR: query
                    ? [
                          {
                              report: {
                                  contains: query,
                                  mode: 'insensitive',
                              },
                          },
                      ]
                    : undefined,
                reportedUser: {
                    bans: {
                        every: {
                            banned: false,
                        },
                    },
                },
            },
            select: {
                id: true,
                report: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                reportedUser: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        return reports.map((report) => ({
            id: report.id,
            reportedUserId: report.reportedUser.id,
            reportedUsername: report.reportedUser.username,
            reportedByUserId: report.author.id,
            reportedByUsername: report.author.username,
            report: report.report,
        }));
    }
}
