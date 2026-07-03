using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MemoryApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMnemonicHintField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MnemonicHint",
                table: "Words",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MnemonicHint",
                table: "Words");
        }
    }
}
