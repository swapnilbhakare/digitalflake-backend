provider "aws" {
  region = "us-east-1"  # Change the region if necessary
}
resource "aws_security_group" "allow_all"{
    name = "allow_all"
    description ="allow_all inbond traffic"
    ingress{
        from_port = 0
        to_port = 65535
        protocol = "tcp"
        cidr_blocks =["0.0.0.0/0"]
    }
    egress{
        from_port = 0
        to_port = 65535
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_instance" "app_instance"{
    ami =  "ami-00d321eaa8a8a4640"
    instance_type = "t2.micro"
    key_name = "devops"
    security_groups = [aws_security_group.allow_all.name]
    
    tags = {
    Name = "MyAppInstance"
  }  
}
output "instance_public_ip" {
  value = aws_instance.app_instance.public_ip
}
