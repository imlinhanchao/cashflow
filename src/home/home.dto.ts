import { ApiProperty } from "@nestjs/swagger";
import { ReportDto } from "src/report/report.dto";

export class HomeDto {
  @ApiProperty({ name: "id", description: "唯一标识符" })
  id?: string;

  @ApiProperty({
    name: "username",
    description: "用户名",
    example: "047f9a52-68e4-4300-8748-70f71267413e",
  })
  username: string;

  @ApiProperty({ name: "x", description: "行号" })
  x: number;

  @ApiProperty({ name: "y", description: "列号" })
  y: number;

  @ApiProperty({ name: "w", description: "宽度" })
  w: number;

  @ApiProperty({ name: "h", description: "高度" })
  h: number;

  @ApiProperty({ name: "index", description: "索引" })
  index: string;

  @ApiProperty({ name: "reportId", description: "统计报表Id" })
  reportId: string;

  @ApiProperty({ name: "report", description: "统计报表配置" })
  report: ReportDto;
}