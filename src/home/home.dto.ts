import { ApiProperty } from "@nestjs/swagger";
import { ReportDto } from "src/report/report.dto";

export class HomeDto {
  @ApiProperty({
    name: "username",
    description: "用户名",
    example: "047f9a52-68e4-4300-8748-70f71267413e",
  })
  username: string;

  @ApiProperty({ name: "row", description: "行号" })
  row: number;

  @ApiProperty({ name: "column", description: "列号" })
  column: number;

  @ApiProperty({ name: "span", description: "宽度" })
  width: number;

  @ApiProperty({ name: "span", description: "高度" })
  height: number;

  @ApiProperty({ name: "report", description: "统计报表配置" })
  report: ReportDto;
}